import React, {useCallback, useMemo} from 'react';
import {Input} from 'antd';
import {movieStore} from '../../store/MovieStore';
import {debounce} from '../../utils/debounce';

const {Search} = Input;

const SearchBar: React.FC = () => {
    const debouncedSearch: (value: string) => void = useMemo(() => {
        return debounce((value: string): void => {
            movieStore.setSearchQuery(value);
            movieStore.fetchMovies();
        }, 500);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        debouncedSearch(e.target.value);
    }, [debouncedSearch]);

    const handleSearch = useCallback((value: string) => {
        movieStore.setSearchQuery(value);
        movieStore.fetchMovies();
    }, []);

    return (
        <div style={{marginBottom: 16}}>
            <Search
                placeholder="Введите название фильма"
                allowClear
                size="large"
                onChange={handleChange}
                onSearch={handleSearch}
                enterButton="Поиск"
            />
        </div>
    );
};

export default SearchBar;
