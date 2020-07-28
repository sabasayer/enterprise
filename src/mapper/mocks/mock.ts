export interface IMockData {
    id: number;
    name: string;
    date: string;
    myObj: object;
}

export const createMock = (id: number): IMockData => {
    return {
        id: id,
        name: "test" + id,
        date: "2012-01-01T00:00:00",
        myObj: {
            field: "test" + id,
        },
    };
};
