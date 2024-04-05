import { Subject } from './subject';
import { User } from './user';

export interface Class {
    id?: string;
    _id?: string;
    subject?: Subject;
    teacher?: User;
}