import { messages } from '../constants/messages.js';
import { controllerWrapper } from '../utils/controllerWrapper.utils.js';
import {
  getPeopleData,
  getPersonData,
  addPeopleData,
  updatePersonData,
  deletePersonData,
} from '../services/people.services.js';

export const getAllPeople = controllerWrapper(
  () => getPeopleData(),
  messages.success.PEOPLE_RETRIEVED
);

export const getPerson = controllerWrapper(
  req => getPersonData(req.params.param),
  messages.success.PERSON_RETRIEVED
);

export const addPerson = controllerWrapper(
  req => addPeopleData(req.body),
  messages.success.PERSON_ADDED,
  201
);

export const updatePerson = controllerWrapper(
  req => updatePersonData(req.params.param, req.body),
  messages.success.PERSON_UPDATED
);

export const deletePerson = controllerWrapper(
  req => deletePersonData(req.params.param),
  messages.success.PERSON_DELETED
);
