export interface Tree {
    id: number;
    species: string;
    plantedAt: Date;
    status: TreeStatus;
}

export type TreeStatus = 'healthy' | 'diseased' | 'dead';