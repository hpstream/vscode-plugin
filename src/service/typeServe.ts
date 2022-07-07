import {instance} from "./zfServe";

export async function addTaskType<T>(parmas: T) {
  return await instance.post(`/taskType/add`, parmas);
}

export async function listTaskType<T>(parmas: T) {
  return await instance.post(`/taskType/list`, parmas);
}

export async function deleteTaskType<T>(parmas: T) {
  return await instance.post(`/taskType/delete`, parmas);
}
