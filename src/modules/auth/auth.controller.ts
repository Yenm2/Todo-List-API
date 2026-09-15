import {request, response} from 'express';
import {AuthService} from './auth.service';

export class authcontroller {
    constructor (private readonly authService: AuthService) {
        