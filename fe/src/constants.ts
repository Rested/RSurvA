import { DocumentIcon, PencilIcon, StarIcon } from '@heroicons/react/24/solid';


export const durations: { [key: number]: string } = {
    1: '1 Minute',
    20: '20 Minutes',
    60: '1 Hour',
    1440: '1 Day', // 60*24
    10080: '1 Week', // 60*24*7
    20160: '2 Weeks', // 60*24*7*2
};


export enum QuestionType {
    ShortText = 'Short Text',
    LongText = 'Long Text',
    Rating = 'Rating',
}

export const iconMapping = {
    [QuestionType.ShortText]: PencilIcon,
    [QuestionType.Rating]: StarIcon,
    [QuestionType.LongText]: DocumentIcon,
    // Add more question types and icons if needed
};

