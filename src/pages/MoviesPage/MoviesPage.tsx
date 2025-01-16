import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { List, Skeleton, Select, Input, Radio } from 'antd';

import { movieStore } from '../../store/MovieStore';
import MovieCard from '../../components/MovieCard/MovieCard';
import SearchBar from '../../components/SearchBar/SearchBar';
// @ts-ignore
import styles from "./MoviesPage.module.scss"

const { Option } = Select;

const MoviesPage: React.FC = observer(() => {
    const {
        filteredAndSortedMovies,
        isLoading,
        page,
        totalPages,
        filterType,
        filterYear,
        sortField,
        sortDirection,
    } = movieStore;

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (movieStore.movies.length === 0) {
            movieStore.fetchMovies();
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !isLoading && page <= totalPages) {
                    movieStore.fetchMovies();
                }
            },
            {
                root: null,
                rootMargin: '300px',
                threshold: 0,
            }
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [isLoading, page, totalPages, movieStore.fetchMovies]);

    const handleDelete = (id: string) => {
        movieStore.deleteMovie(id);
    };

    const handleEdit = (id: string) => {
        const newTitle = prompt('Введите новое название фильма') || '';
        if (newTitle.trim()) {
            movieStore.editMovie(id, newTitle);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Список фильмов (OMDb)</h1>

            <SearchBar />

            <div className={styles.filtersBar}>
                <Select
                    style={{ width: 120, marginRight: 8 }}
                    value={filterType}
                    onChange={(val) => movieStore.setFilterType(val)}
                >
                    <Option value="all">Все</Option>
                    <Option value="movie">Movies</Option>
                    <Option value="series">Series</Option>
                    <Option value="episode">Episodes</Option>
                </Select>

                <Input
                    style={{ width: 100, marginRight: 8 }}
                    placeholder="Год"
                    value={filterYear}
                    onChange={(e) => movieStore.setFilterYear(e.target.value)}
                />

                <Select
                    style={{ width: 120, marginRight: 8 }}
                    value={sortField}
                    onChange={(val) => movieStore.setSortField(val)}
                >
                    <Option value="none">Без сортировки</Option>
                    <Option value="title">По названию</Option>
                    <Option value="year">По году</Option>
                    <Option value="type">По типу</Option>
                </Select>

                <Radio.Group
                    value={sortDirection}
                    onChange={(e) => movieStore.setSortDirection(e.target.value)}
                >
                    <Radio.Button value="asc">Asc</Radio.Button>
                    <Radio.Button value="desc">Desc</Radio.Button>
                </Radio.Group>
            </div>

            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={filteredAndSortedMovies}
                renderItem={(movie) => (
                    <List.Item>
                        <MovieCard
                            id={movie.id}
                            title={movie.title}
                            year={movie.year}
                            type={movie.type}
                            poster={movie.poster}
                            isEdited={movie.isLocallyEdited}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </List.Item>
                )}
            />

            {isLoading && <Skeleton active />}

            {page <= totalPages && (
                <div ref={loaderRef} className={styles.loaderPlaceholder} />
            )}
        </div>
    );
});

export default MoviesPage;
