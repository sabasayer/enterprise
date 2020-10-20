# @sabasayer/enterprise

There are 5 parts of ui projects. Api , Data store , Logic , Mapper , UI

1. **Api :** Handles requests and response from backend

2. **Data store :** Stores data that get from backend or only local data. Handles caching etc.
3. **Logic :** Communicates with data store or sometimes directly api. 
Changes data accordingly to needs of backend and ui. Also validates to data. Acts as gatekeeper between ui and backend
4. **Mapper :** Maps domain models to viewModels and vice versa.
5. **UI :** Renders data and handles user input. 
UI frameworks ( vue , react vs.) dont need to know logic and where and how data is stored.

This projects acts as a guide for first 4 parts and also provides usefull tools.

Check **examples.ts** file , **comed** and **patient** folder for usage examples.
Check **docs** folder for detailed documents.

# How to use ?

Main part of this framework is `EnterpriseApi` class which handles requests.

To create `EnterpriseApi` instance 

```typescript
const enterpriseApi = enterpirseBoot({
    languagePrefix: "tr-tr",
    dataField: "data",
    hostName:'myHostName.com',
    headers: {
        "content-type": "application/json",
    },
    authTokenHeaderKey: "x-authentication-token"
});

```

This will ensure that all `Logic` classes injected `EnterpriseApi` instance

----------

Second part is `DataProvider` which contains `Entity` spesific methods and options to provide data from api or cache  

Third part is `Logic` which contains `Entity` spesific Business Logic codes and has a `DataProvider` object

----------

Fore example if we have `User` model we will have minimum 2 files in **User* folder* :

`UserDataProvider` , `UserLogic` 

`DataProvider` and `Logic` accepts **EnterpriseApi** object at the constructor

```typescript
export class UserDataProvider extends EnterpriseDataProvider {
    constructor(api: EnterpriseApi) {
        super(api);
    }
    ...
}


export class UserLogic extends EnterpriseLogic {
    static instance: UserLogic;
    private provider: UserDataProvider;

    constructor(api: EnterpriseApi) {
        super();
        this.provider = new UserDataProvider(api);
    }

    ...
}

AuthLogic.register();

```

`Logic` is a singleton class. To initialize that with `EnterpriseApi` intance `register` method must be called .


----------

`DataProvider` and  `Logic` has one more variations that is customized for collections.  

`EnterpriseCollectionProvider` , `EnterpriseCollectionLogic`

These classes contains predefined cache, save, get, delete logic.


# 1. Enterprise Api

Manages the communication with api's with help of **axios**

To use initialize an object from **EnterpriseApi** class

```typescript
const enterpriseApi = new EnterpriseApi({
    baseUrl: 'http://mytest.api.io'
});
```

constructor requires an object typeof `EnterpriseApiOptions`

```typescript
interface EnterpriseApiOptions {
    baseUrl?: string;
    protocol?: "http" | "https";
    /**
     * en-us , tr-tr , etc.
     */
    languagePrefix?: string;
    /**
     * json , api :
     * myapp.com/json , myapp.com/api
    */
    prefix?: string;
    hostName?: string;
    headers?: Record<string, string>;
    /**
     * key: current hostname that app is running, 
     * value: hostName to use at baseUrl
     * {'myapp.com':'endpoint1.com',
     * 'myApp2.com':'endpoint2.com'}
     */
    endpoints?: Record<string, string>;
    /**
     * sometimes api returns {data:[{...}]}
     * dataField = 'data'
     */
    dataField?: string;
    createErrorMessagesFunc?: (response: AxiosResponse) => ErrorMessages;
    authTokenHeaderKey?: string;
}
```

> If **baseUrl** is empty api creates baseUrl from other options.

# 2. Enterprise Data House

Handler for cached data. It is an **static** class.

```typescript
class EnterpriseDataHouse {
    static instance: EnterpriseDataHouse;

    get<TModel>(
        type: EnumCacheType,
        typename: string,
        uniqueCacheKey?: string
    ): TModel[] 

    set<TModel>(
        type: EnumCacheType,
        typename: string,
        collection: TModel[],
        uniqueCacheKey?: string
    ): void

    clear(type: EnumCacheType, typename: string, uniqueCacheKey?: string)  

    addItems<TModel>(
        type: EnumCacheType,
        typename: string,
        collection: TModel[],
        compareFunc?: (cachedItem: TModel, item: TModel) => boolean,
        uniqueCacheKey?: string
    ): void 

    removeItems<TModel>(
        type: EnumCacheType,
        typename: string,
        filterFunc: (item: TModel) => boolean
    )
}

```

# 3. Enterprise Data Provider

Handles api requests. Request object validation , cancalleble requests, prevent same requests.
Extends `EnterpriseCancellable` which handles request cancellation

```typescript
 class EnterpriseDataProvider extends EnterpriseCancellable {

     constructor(api: EnterpriseApi)

    /**
     * Returns cancel token and response.
     */
    cancellableApiRequest<TRequest, TResponseModel>(
        options: IApiRequestOptions,
        request: TRequest,
        mustCheckWaitingRequest: boolean = true
    ): ICancellableApiResponse<TResponseModel> ;

    /**
     * Validates request, handles cancelation and response
     * @param cancelTokenUniqueKey unique string for grouping sameRequest.
     * Cancels existing waiting promises with same unique key and request.
     * @param mustCheckWaitingRequest Prevents paralel same request
     */
    async apiRequest<TRequest, TResponseModel>(
        options: IApiRequestOptions,
        request: TRequest,
        cancelTokenUniqueKey?: string,
        mustCheckWaitingRequest: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<IApiResponse<TResponseModel>> ;


    fileUpload(
        options: IEnterpriseRequestOptions,
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    ): Promise<AxiosResponse<any>> ;

}

```

# 4. Enterprise Collection Provider

Extends `EnterpriseCollectionProvider` and `EnterpriseCollectionCacheProvider` which handles caching for collections.

Also have get, save, delete, subscribe methods.

```typescript
class EnterpriseCollectionProvider<
    TModel,
    TGetRequest,
    TSaveServiceRequest = undefined,
    TDeleteServiceRequest = undefined,
    TSaveRequest = ExtractRequest<TSaveServiceRequest>,
    TSaveResponse = ExtractResult<TSaveServiceRequest>,
    TDeleteRequest = ExtractRequest<TDeleteServiceRequest>,
    TDeleteResponse = ExtractResult<TDeleteServiceRequest>
> {

    constructor(
        api: EnterpriseApi,
        options: EnterpriseCollectionOptions<TModel>
    )

    subscribe(options: IEnterpriseSubscription<TModel>) 

    unsubscribe(id: string) 

    /**
     * Decides where data will be provided by options.
     * Cache or Api
     * @param getOptions how to compare and get data
     * @param apiFunc api call function to get from backend
     */
    async get(
        getRequest: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<IApiResponse<TModel[]> | never>

    createRequestHash<TRequest>(request: TRequest) 

    /**
     * @param cancelTokenUniqueKey Group cancel tokens by this key.
     * And cancel previous ones with same key
     */
    async getFromApi<TGetRequest>(
        request: TGetRequest,
        cancelTokenUniqueKey?: string
    ): Promise<IApiResponse<TModel[]>> 

    /**
     * @param mapResponseToModel Runs after request succeeded,
     * creates array for saving to cache
     */
    async save(
        request: TSaveRequest,
        mapResponseToModel?: (response: TSaveResponse) => TModel[]
    ): Promise<IApiResponse<TSaveResponse>> 

    handleSideEffects() 

    /**
     * @param ids Removed item ids to remove from cache
     */
    async delete(
        request: TDeleteRequest,
        ids?: (string | number)[]
    ): Promise<IApiResponse<TDeleteResponse>> 
}

//usage

interface Model {
    name: string;
}

interface GetRequest {}

interface SaveRequest {
    models: Model[];
}

interface SaveResponse {
    ids: number[];
}

interface DeleteRequest {
    ids: number[];
}

interface DeleteResponse {
    ids: Record<number, boolean>;
}

class TestProvider extends EnterpriseCollectionProvider<
    Model,
    GetRequest,
    ServiceRequest<SaveRequest, SaveResponse>,
    ServiceRequest<DeleteRequest, DeleteResponse>
> {
    constructor(api: IEnterpriseApi) {
        super(api, {
            typename: "model",
        });
    }

```

# 5. EnterpriseLogic

Write Business Logic code inside this class. UI only uses this class

```typescript
class EnterpriseLogic {
    static instance: EnterpriseLogic;

    constructor(api?: EnterpriseApi) 

    /**
     * Registers to LogicBoot static class. 
     * Registered logics will use main EnterpriseApi.
     * Don't register if you want to use different EnterpriseApi
     */
    static register()
}

```

# 6. EnterpriseCollectionLogic

Business Logic for collections.

Uses `ExtractGetRequest` type helper to extract RequestTypes from `CollectionProvider`

```typescript
 class EnterpriseCollectionLogic<
    TModel,
    TCollectionProvider extends EnterpriseCollectionProvider<
        TModel,
        any,
        any,
        any,
        any,
        any
    >,
    TViewModel = undefined,
    TGetRequest = ExtractGetRequest<TCollectionProvider>,
    TSaveRequest = ExtractSaveRequest<TCollectionProvider>,
    TSaveResponse = ExtractSaveResponse<TCollectionProvider>,
    TDeleteRequest = ExtractDeleteRequest<TCollectionProvider>,
    TDeleteResponse = ExtractDeleteResponse<TCollectionProvider>
> extends EnterpriseLogic {

    constructor(
        api: EnterpriseApi,
        provider: { new (api: EnterpriseApi): TCollectionProvider },
        mapper?: { new (): EnterpriseMapper<TModel, TViewModel> },
        vmIdField?: keyof TViewModel
    ) 
  
    subscribe(options: IEnterpriseSubscription<TModel>)

    unsubscribe(id: string) 

    async get(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<
        IApiResponse<(TViewModel extends undefined ? TModel : TViewModel)[]>
    > 

    async getOne(
        request: TGetRequest,
        getOptions?: GetCollectionOptions<TModel>
    ): Promise<
        IApiResponse<TViewModel extends undefined ? TModel : TViewModel>
    > 

    validate?(
        model: TViewModel extends undefined ? TModel : TViewModel
    ): IValidationResult | Promise<IValidationResult>;

    async validateMany(
        models: (TViewModel extends undefined ? TModel : TViewModel)[]
    ): Promise<IValidationResult> 

    getIdFromItem(model: TViewModel extends undefined ? TModel : TViewModel) 

    async saveOne(
        model: TViewModel extends undefined ? TModel : TViewModel,
        createSaveRequest: (model: TModel) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>> 

    async save(
        models: (TViewModel extends undefined ? TModel : TViewModel)[],
        createSaveRequest: (models: TModel[]) => TSaveRequest
    ): Promise<IApiResponse<TSaveResponse>> 

    async delete(
        options: TDeleteRequest
    ): Promise<IApiResponse<TDeleteResponse>> 
}

//usage


class TestLogic extends EnterpriseCollectionLogic<Model, TestProvider> {
    static instance: TestLogic;

    constructor(api: IEnterpriseApi) {
        super(api, TestProvider);
    }
}

TestLogic.instance.register();

...

TestLogic.instance.get({});
TestLogic.instance.save([], (models) => ({
    models,
}));
TestLogic.instance.delete({ ids: [] });


```

# 7. EnterpriseMapper

Maps from one object to another with options. 

Initialize with object

```typescript
type EnterpriseMapperOptions<TModel, TViewModel> = {
    toViewModel?: MapOptions<TModel, TViewModel>;
    toModel?: MapOptions<TViewModel, TModel>;
};

type MapOptions<TModel1, TModel2> = {
    onlyMapDefinedFields?: boolean;
    ignoredFields?: (keyof TModel1)[];
    mappers?: {
        [K in keyof TModel2]?: mapField<TModel1, TModel2, K> | keyof TModel1;
    };
};

type mapField<TModel1, TModel2, TModel2Field extends keyof TModel2> = (
    model1: TModel1,
    model2Field?: TModel2Field
) => TModel2[TModel2Field];


...


class EnterpriseMapper<TModel, TViewModel> {

    constructor(options: EnterpriseMapperOptions<TModel, TViewModel>)

    defaultViewModel?(): TViewModel;

    mapListToVm(models?: TModel[]): TViewModel[]

    mapListToModel(viewModels?: TViewModel[]): TModel[] 
    mapToVm(model: TModel): TViewModel

    mapToModel(model: TViewModel): TModel 

    private map<TModel1, TModel2>(
        model: TModel1,
        options?: MapOptions<TModel1, TModel2>
    ): TModel2 
}


```


#### For VsCode jest extension users

set jest.pathToJest settings :

"jest.pathToJest": "lerna run test --stream --"