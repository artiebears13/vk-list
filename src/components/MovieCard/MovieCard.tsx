import React from 'react';
import { Card, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import styles from './MovieCard.module.scss';
import { movieStore } from '../../store/MovieStore';
import {observer} from "mobx-react-lite";

const { Meta } = Card;

interface MovieCardProps {
    id: string;
    title: string;
    year: string;
    type: string;
    poster: string;
    isEdited?: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = observer(({
                                                 id,
                                                 title,
                                                 year,
                                                 type,
                                                 poster,
                                                 isEdited,
                                                 onEdit,
                                                 onDelete,
                                             }) => {
    const hasPoster = poster && poster !== 'N/A';

    const isFav: boolean = movieStore.isFavorite(id);

    const handleToggleFavorite: () => void = () => {
        movieStore.toggleFavorite(id);
    };

    return (
        <div className={styles.cardWrapper}>
            <Card
                className={styles.card}
                hoverable
                cover={
                    hasPoster ? (
                        <img alt={title} src={poster} className={styles.posterImage} />
                    ) : (
                        <div className={styles.noPoster}>{title}</div>
                    )
                }
                actions={[
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(id)}
                    />,
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(id)}
                    />,
                ]}
            >
                <Meta
                    title={
                        isEdited ? <span style={{ color: 'red' }}>{title}</span> : title
                    }
                    description={
                        <>
                            <div>Год: {year}</div>
                            <div>Тип: {type}</div>
                        </>
                    }
                />
            </Card>

            <div className={`${styles.favoriteIcon} ${isFav && styles.showFav}`}>
                <Tooltip title={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}>
                    {isFav ? (
                        <StarFilled
                            style={{ fontSize: 24, color: '#faad14' }}
                            onClick={handleToggleFavorite}
                        />
                    ) : (
                        <StarOutlined
                            style={{ fontSize: 24, color: '#faad14' }}
                            onClick={handleToggleFavorite}
                        />
                    )}
                </Tooltip>
            </div>
        </div>
    );
});

export default MovieCard;
