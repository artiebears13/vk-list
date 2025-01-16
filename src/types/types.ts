export interface IMovie {
    id: string;
    title: string;
    year: string;
    type: string;
    poster: string;
    isLocallyEdited?: boolean;
    isLocallyDeleted?: boolean;
}

export type SortField = 'none' | 'title' | 'year' | 'type';
export type SortDirection = 'asc' | 'desc';