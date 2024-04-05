import { Class } from './class';

export interface Lesson
{
    id?: string;
    _id?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    class?: Class;
}