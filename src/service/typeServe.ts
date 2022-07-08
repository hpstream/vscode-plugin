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

export async function taskstar<T>(parmas: T) {
  return await instance.post(`/task/star`, parmas);
}

export async function taskMy<T>(parmas: T) {
  return await instance.post(`/task/my`, parmas);
}

export async function taskover<T>(parmas: T) {
  return await instance.post(`/task/over`, parmas);
}

export async function taskList<T>(parmas: T) {
  return await instance.post(`/task/list`, parmas);
}

export async function onlineCount<T>(parmas: T) {
  return await instance.post(`/task/onlineCount`, parmas);
}
