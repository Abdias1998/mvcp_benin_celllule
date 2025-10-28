import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getHierarchy(req: any): Promise<import("./schemas/user.schema").User[]>;
    create(createUserDto: CreateUserDto): Promise<import("./schemas/user.schema").UserDocument>;
    findPending(): Promise<import("./schemas/user.schema").User[]>;
    findAll(): Promise<import("./schemas/user.schema").User[]>;
    approve(id: string): Promise<import("./schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").User>;
    remove(id: string): Promise<any>;
}
