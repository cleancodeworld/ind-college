/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Reducer, AnyAction  } from 'redux'
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { action } from 'typesafe-actions'
import { apiEndpoints, signinIfUnauthorized } from '../effects'
import { IApiState, TaskErrorReducer, TaskStartReducer, TaskSuccessReducer, IEntityRequest, IDepartment, IUnit, defaultState, ISupportRelationship } from '../types'
import { restApi, IApi, IApiResponse } from '../api';

//#region TYPES
export const enum DepartmentActionTypes {
    DEPARTMENT_FETCH_REQUEST = '@@department/FETCH_REQUEST',
    DEPARTMENT_FETCH_SUCCESS = '@@department/FETCH_SUCCESS',
    DEPARTMENT_FETCH_ERROR = '@@department/FETCH_ERROR',
    DEPARTMENT_FETCH_PROFILE_REQUEST = '@@department/FETCH_PROFILE_REQUEST',
    DEPARTMENT_FETCH_PROFILE_SUCCESS = '@@department/FETCH_PROFILE_SUCCESS',
    DEPARTMENT_FETCH_PROFILE_ERROR = '@@department/FETCH_PROFILE_ERROR',
    DEPARTMENT_FETCH_MEMBER_UNITS_REQUEST = '@@department/FETCH_MEMBER_UNITS_REQUEST',
    DEPARTMENT_FETCH_MEMBER_UNITS_SUCCESS = '@@department/FETCH_MEMBER_UNITS_SUCCESS',
    DEPARTMENT_FETCH_MEMBER_UNITS_ERROR = '@@department/FETCH_MEMBER_UNITS_ERROR',
    DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST = '@@department/FETCH_SUPPORTING_UNITS_REQUEST',
    DEPARTMENT_FETCH_SUPPORTING_UNITS_SUCCESS = '@@department/FETCH_SUPPORTING_UNITS_SUCCESS',
    DEPARTMENT_FETCH_SUPPORTING_UNITS_ERROR = '@@department/FETCH_SUPPORTING_UNITS_ERROR',
}

export interface IState {
  profile: IApiState<IEntityRequest, IDepartment>;
  memberUnits: IApiState<IEntityRequest, IUnit[]>;
  supportingUnits: IApiState<IEntityRequest, ISupportRelationship[]>;
}
//#endregion


//#region ACTIONS
export const fetchRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, request)
const fetchProfileRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_REQUEST, request)
const fetchProfileSuccess = (response: IApiResponse<IDepartment>) => action(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_SUCCESS, response)
const fetchProfileError = (error: Error) => action(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_ERROR, error)
const fetchMemberUnitsRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_REQUEST, request)
const fetchMemberUnitsSuccess = (response: IApiResponse<IUnit[]>) => action(DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_SUCCESS, response)
const fetchMemberUnitsError = (error: Error) => action(DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_ERROR, error)
const fetchSupportingUnitsRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST, request)
const fetchSupportingUnitsSuccess = (response: IApiResponse<ISupportRelationship[]>) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_SUCCESS, response)
const fetchSupportingUnitsError = (error: Error) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_ERROR, error)
//#endregion


//#region REDUCER
export const initialState: IState = {
  profile: defaultState(),
  memberUnits: defaultState(),
  supportingUnits: defaultState(),
}

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_REQUEST: return {...state, profile: TaskStartReducer(state.profile, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_SUCCESS: return { ...state, profile: TaskSuccessReducer(state.profile, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_ERROR: return { ...state, profile: TaskErrorReducer(state.profile, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_REQUEST: return { ...state, memberUnits: TaskStartReducer(state.memberUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_SUCCESS: return { ...state, memberUnits: TaskSuccessReducer(state.memberUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_ERROR: return { ...state, memberUnits: TaskErrorReducer(state.memberUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST: return { ...state, supportingUnits: TaskStartReducer(state.supportingUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_SUCCESS: return { ...state, supportingUnits: TaskSuccessReducer(state.supportingUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_ERROR: return { ...state, supportingUnits: TaskErrorReducer(state.supportingUnits, act) }
    default: return state
  }
}
//#endregion

const api = restApi();

//#region SAGA
function* handleFetch(req: IEntityRequest) {
  yield put(fetchProfileRequest(req))
  yield put(fetchMemberUnitsRequest(req))
  yield put(fetchSupportingUnitsRequest(req))
}

function* handleFetchProfile(api:IApi,req:IEntityRequest){
  const action = 
  yield api.get<IDepartment>(apiEndpoints.departments.root(req.id))
    .then(fetchProfileSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchProfileError)
yield put (action);
}

function* handleConstituentUnitsFetch(api: IApi, req: IEntityRequest) {
  const action = 
    yield api
      .get<IUnit[]>(apiEndpoints.departments.memberUnits(req.id))
      .then(fetchMemberUnitsSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchMemberUnitsError);
  yield put(action);
}

function* handleSupportingUnitsFetch(api: IApi, req: IEntityRequest) {
  const action = 
    yield api
      .get<ISupportRelationship[]>(apiEndpoints.departments.supportingUnits(req.id))
      .then(fetchSupportingUnitsSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchSupportingUnitsError);
  yield put(action);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchDepartmentFetch() {
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, (a: AnyAction) => handleFetch(a.payload))
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_REQUEST, (a: AnyAction) => handleFetchProfile(api, a.payload))
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_MEMBER_UNITS_REQUEST, (a: AnyAction) => handleConstituentUnitsFetch(api, a.payload))
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST, (a: AnyAction) => handleSupportingUnitsFetch(api, a.payload))
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchDepartmentFetch)])
}
//#endregion
