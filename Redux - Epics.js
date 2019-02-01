//@flow
import { combineEpics, ofType } from 'redux-observable';
import { map, mergeMap, catchError, delay, tap, mapTo, takeUntil, debounceTime } from 'rxjs/operators';
import { from, of, fromEvent, Observable } from 'rxjs';

import { addUser, setSearch } from './actions';
import { FETCH_USER, SEARCH_USER } from './types';

import type { User } from './models';

const fetchUser = (name: string) => fetch(`https://api.github.com/users/${name}`)
  .then((r) => {
    if (r.status !== 200) throw new Error('FETCH ERROR');
    return r.json();
  });

const searchUser = (name: string) => fetch(`https://api.github.com/search/users?q=${name}`)
  .then((r) => {
    if (r.status !== 200) throw new Error('FETCH ERROR');
    return r.json();
  });

const mapUser = ({ id, login, public_repos, avatar_url }): User => ({
  id,
  name: login,
  repos: public_repos,
  avatar: avatar_url,
});

const mapUsers = ({ items }): User[] => items.slice(0, 5).map(({ id, login }) => ({ id, name: login }));

const fetchUserEpic = action$ => action$.pipe(
  ofType(FETCH_USER),
  mergeMap(({ payload }) => 
    from(fetchUser(payload.name)).pipe(
      map(mapUser),
      map(addUser),
      catchError(e => of({ type: 'FAIL', payload: { message: e.message } })),
    ))
);

const searchUserEpic = action$ => action$.pipe(
  ofType(SEARCH_USER),
  debounceTime(500),
  mergeMap(({ payload }) => 
    from(searchUser(payload.name)).pipe(
      map(mapUsers),
      map(setSearch),
      catchError(e => of({ type: 'FAIL', payload: { message: e.message } })),
    )
  ),  
);

const parseEventData = ({ data }) => JSON.parse(data);

const websocketEpic = () => {
  const ws = new WebSocket('wss://echo.websocket.org');
  ws.addEventListener('open', () => {
    ws.send(JSON.stringify({ type: 'message', data: { text: 'Hello!', author: 'user', channel: 1 } }));
  });
  return fromEvent(ws, 'message').pipe(
    map(parseEventData),
    map(event => ({ type: 'SOCKET/EVENT', payload: { event } }))
  );
};

export const epics = combineEpics(fetchUserEpic, searchUserEpic, websocketEpic);