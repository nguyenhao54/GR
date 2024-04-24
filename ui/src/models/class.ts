import { Subject } from './subject';
import { User } from './user';

export interface Class {
    id?: string;
    _id?: string;
    classId?: string;
    subject?: Subject;
    teacher?: User;
}