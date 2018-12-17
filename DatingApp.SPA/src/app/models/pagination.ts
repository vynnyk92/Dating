export interface Pagination {
    currentPage?: number, 
    itemsPerPage?: number,
    totalPages ?: number,
    totalItems?: number,  
}

export class PaginatedResult<T>{
    result:T;
    pagination: Pagination; 
}

export interface UserFilter{
    minAge?: number;
    maxAge?: number;
    gender?: string;
}