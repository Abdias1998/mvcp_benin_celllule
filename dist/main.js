"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['https://mvcp-cdm.netlify.app', 'http://localhost:3000'],
        credentials: true,
    });
    console.log('✅ MONGO_URI =', process.env.MONGO_URI);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map