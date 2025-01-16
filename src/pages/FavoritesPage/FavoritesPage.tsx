import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { movieStore } from '../../store/MovieStore';
import { List } from 'antd';
import MovieCard from '../../components/MovieCard/MovieCard';

const FavoritesPage: React.FC = observer(() => {
    const {
        favoriteMovies,
        favoriteIds,
    } = movieStore;

    useEffect(() => {
        movieStore.fetchFavoriteMovies();
    }, [movieStore.fetchFavoriteMovies]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Избранные фильмы</h1>

            {favoriteIds.length === 0 && (
                <p>Нет избранных фильмов.</p>
            )}

            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={favoriteMovies}
                renderItem={(movie) => (
                    <List.Item>
                        <MovieCard
                            id={movie.id}
                            title={movie.title}
                            year={movie.year}
                            type={movie.type}
                            poster={movie.poster}
                            onEdit={(id) => movieStore.editMovie(id, prompt('Новое название') || '')}
                            onDelete={(id) => movieStore.toggleFavorite(id)}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
});

export default FavoritesPage;
