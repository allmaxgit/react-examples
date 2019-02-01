import {
  always, assoc, assocPath,
  over, lensPath, dissocPath,
  reduce, mergeDeepLeft, pipe
} from 'ramda';

import { createReducer } from '$libs/reducerUtils';
import TYPES from '../types';

const initState = {
  list: {},
  loading: false,
  search: [],
};

const setAgentsList = ({ list }) => {
  const normalizedList = reduce((obj, agent) => assoc(agent.id, agent, obj), {}, list);
  return pipe(
    over(lensPath(['list']), mergeDeepLeft(normalizedList)),
    assoc('loading', false)
  );
};

const setAgentData = ({ agent }) =>
  over(lensPath(['list', agent.id]), mergeDeepLeft(agent));

const setAgentParam = paramName => payload =>
  assocPath(['list', payload.agentId, paramName], payload[paramName]);

const addAgent = ({ agent }) => assocPath(['list', agent.id], agent);
const blockAgent = ({ agentId }) => dissocPath(['list', agentId]);
const setSearchResult = ({ users = [] }) => assoc('search', users);
const clear = () => always(initState);

export const reducer = createReducer(initState, {
  [TYPES.SET_AGENTS_LIST]: setAgentsList,
  [TYPES.SET_AGENT_DATA]: setAgentData,
  [TYPES.ADD_AGENT]: addAgent,
  [TYPES.BLOCK_AGENT]: blockAgent,
  [TYPES.SET_AGENT_AVATAR]: setAgentParam('avatar'),
  [TYPES.SET_AGENT_ROLE]: setAgentParam('role'),
  [TYPES.CHANGE_AGENT_ROLE]: setAgentParam('role'),
  [TYPES.SET_SEARCH_RESULT]: setSearchResult,
  [TYPES.CLEAR_DATA]: clear,
});