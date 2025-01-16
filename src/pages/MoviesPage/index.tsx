// src/pages/MoviesPage/index.tsx

import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { movieStore } from '../../store/MovieStore';
import { List, Button, Skeleton, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import styles from './MoviesPage.module.css'; // стили через CSS-модули

const MoviesPage: React.FC = observer(() => {
    const { movies, fetchMovies, isLoading, page, totalPages, deleteMovie, editMovie } = movieStore;

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // При первой загрузке
        if (movies.length === 0) {
            fetchMovies();
        }
    }, [fetchMovies, movies.length]);

    useEffect(() => {
        // IntersectionObserver для бесконечного скролла
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !isLoading && page <= totalPages) {
                    fetchMovies();
                }
            },
            {
                root: null, // viewport
                rootMargin: '500px', // подгрузка чуть заранее
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
    }, [isLoading, page, totalPages, fetchMovies]);

    const handleDelete = (id: number) => {
        deleteMovie(id);
    };

    const handleEdit = (id: number) => {
        const newTitle = prompt('Введите новое название фильма') || '';
        if (newTitle.trim()) {
            editMovie(id, newTitle);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Популярные фильмы TMDB</h1>

            <List
                dataSource={movies}
                renderItem={(movie) => (
                    <List.Item
                        actions={[
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(movie.id)}
                            />,
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(movie.id)}
                            />,
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <span style={{ color: movie.isLocallyEdited ? 'red' : 'inherit' }}>
                  {movie.title}
                </span>
                            }
                        />
                    </List.Item>
                )}
            />

            {/* Индикатор загрузки */}
            {isLoading && <Skeleton active />}

            {/* "Невидимый" блок, за которым следит IntersectionObserver */}
            {page <= totalPages && <div ref={loaderRef} style={{ height: 1 }} />}
        </div>
    );
});

export default MoviesPage;
