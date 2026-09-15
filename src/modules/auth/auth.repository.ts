export interface UserEntity {
    id: string;
    username: string;
    password: string;
    created_at: Date;
}
export class AuthRepository {
    private users: UserEntity[] = [];

async findByusername(username:string): Promise<UserEntity | null> {
    const user = this.users.find(u => u.username === username);
    return user ?? null
}

async findById(id: string): Promise<UserEntity | null> {
    const user = this.users.find(u => u.id === id);
    return user ?? null;
}

async create(username: string, password: string): Promise<UserEntity> {
    const newUser: UserEntity = {
        id: crypto.randomUUID(),
        username,
        password: password,
        created_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
}}