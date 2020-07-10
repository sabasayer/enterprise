export interface IMockData {
    id: number
    name: string
}


export const createMock = (prefix:number): IMockData[] => [
    {
        id: prefix+1,
        name: prefix+'test'
    },
    {
        id: prefix+2,
        name: prefix+'test 2'
    },
    {
        id: prefix+3,
        name: prefix+'test 3'
    }
]