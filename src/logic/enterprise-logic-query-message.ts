export interface EnterpriseLogicQueryMessage<TModel> {
    loading: boolean
    error?: Error
    data: TModel
}