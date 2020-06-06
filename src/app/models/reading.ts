export class Reading {
    pageCount: number;
    size: number;
    totalCount: number;
    data: Data[];

}

export class Data {
    value: number[];
    timestamp: Date[];
    buildingName: string;
    datapointName: string;
}