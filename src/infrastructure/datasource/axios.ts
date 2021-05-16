import axios from 'axios';
import { DatasourceBindings } from './bindings';

export function createAxios() {
	DatasourceBindings.Axios.value = axios.create();
}
