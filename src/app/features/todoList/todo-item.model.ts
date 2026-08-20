export interface TodoItemResponse {
    id: number,
    header: string,
    detail: string,
    createdOn: Date,
    completedBy: Date
}

export interface TodoItemCreateRequest {
    header: string,
    detail: string,
    completedBefore: string
}