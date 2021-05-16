export interface Model {}

export interface ModelStatic<TEntity> {
	new (): Model & { toEntity(): Partial<TEntity> };

	fromEntity(entity: TEntity): Model;
}

export type Identifiable<T extends { id: any } | { id?: any }> = Omit<
	T,
	'id'
> & {
	id: T['id'];
};
