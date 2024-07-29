import { DocumentIcon, PencilIcon, StarIcon } from '@heroicons/react/24/solid';


export const durations: { [key: number]: string } = {
    10: '10 seconds',
    60: '1 Minute',
    1200: '20 Minutes', // 20 * 60
    3600: '1 Hour', // 60 * 60
    86400: '1 Day', // 60 * 60 * 24
    604800: '1 Week', // 60 * 60 * 24 * 7
    1209600: '2 Weeks', // 60 * 60 * 24 * 7 * 2
};

export enum QuestionType {
    // eslint-disable-next-line no-unused-vars
    ShortText = 'Short Text',
    // eslint-disable-next-line no-unused-vars
    LongText = 'Long Text',
    // eslint-disable-next-line no-unused-vars
    Rating = 'Rating',
}

export const iconMapping = {
    [QuestionType.ShortText]: PencilIcon,
    [QuestionType.Rating]: StarIcon,
    [QuestionType.LongText]: DocumentIcon,
    // Add more question types and icons if needed
};


