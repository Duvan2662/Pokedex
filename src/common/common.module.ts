import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapte';

@Module({
    providers:[AxiosAdapter],
    exports:[AxiosAdapter],
})
export class CommonModule {}
