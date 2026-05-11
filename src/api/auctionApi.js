
// const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// async function req(method, path, body) {
//   const res = await fetch(`${BASE}${path}`, {
//     method,
//     headers: { 'Content-Type': 'application/json' },
//     body: body ? JSON.stringify(body) : undefined,
//   });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ error: res.statusText }));
//     throw new Error(err.error || res.statusText);
//   }
//   if (res.status === 204) return null;
//   return res.json();
// }

// export const getFullState    = ()           => req('GET',  '/state');
// export const resetAuction    = ()           => req('POST', '/reset');

// export const getTeams        = ()           => req('GET',    '/teams');
// export const addTeam         = (body)       => req('POST',   '/teams', body);
// export const editTeam        = (id, body)   => req('PUT',    `/teams/${id}`, body);
// export const deleteTeam      = (id)         => req('DELETE', `/teams/${id}`);

// export const getPlayers      = ()           => req('GET',    '/players');
// export const addPlayer       = (body)       => req('POST',   '/players', body);
// export const editPlayer      = (id, body)   => req('PATCH',  `/players/${id}`, body);
// export const removePlayer    = (id)         => req('DELETE', `/players/${id}`);

// export const startBidding    = (playerId)   => req('POST', `/auction/start/${playerId}`);
// export const placeBid        = (teamId)     => req('POST',  '/auction/bid',       { teamId });
// export const incrementBid    = (amount)     => req('POST',  '/auction/increment',  { amount });
// export const confirmSold     = (teamId, amount) => req('POST', '/auction/sell',    { teamId, amount });
// export const markUnsold      = ()           => req('POST',  '/auction/unsold');
// export const reAuction       = (playerId)   => req('POST', `/auction/reauction/${playerId}`);
// export const useRTM          = (teamId)     => req('POST', `/auction/rtm/${teamId}`);
// export const useWildcard     = (teamId)     => req('POST', `/auction/wildcard/${teamId}`);
// export const switchQueueTab  = (tab)        => req('POST', `/auction/tab/${tab}`);

// export const getRegistered       = ()       => req('GET',    '/registered');
// export const addRegistered       = (body)   => req('POST',   '/registered', body);
// export const editRegistered      = (id, b)  => req('PATCH',  `/registered/${id}`, b);
// export const removeRegistered    = (id)     => req('DELETE', `/registered/${id}`);
// export const sendToAuction       = (id)     => req('POST',  `/registered/${id}/send-to-auction`);





const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json'},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getFullState    = ()           => req('GET',  '/state');
export const resetAuction    = ()           => req('POST', '/reset');

export const getTeams        = ()           => req('GET',    '/teams');
export const addTeam         = (body)       => req('POST',   '/teams', body);
export const editTeam        = (id, body)   => req('PUT',    `/teams/${id}`, body);
export const deleteTeam      = (id)         => req('DELETE', `/teams/${id}`);

export const getPlayers      = ()           => req('GET',    '/players');
export const addPlayer       = (body)       => req('POST',   '/players', body);
export const editPlayer      = (id, body)   => req('PATCH',  `/players/${id}`, body);
export const removePlayer    = (id)         => req('DELETE', `/players/${id}`);

export const startBidding    = (playerId)   => req('POST', `/auction/start/${playerId}`);
export const placeBid        = (teamId)     => req('POST',  '/auction/bid',       { teamId });
export const incrementBid    = (amount)     => req('POST',  '/auction/increment',  { amount });
export const confirmSold     = (teamId, amount) => req('POST', '/auction/sell',    { teamId, amount });
export const markUnsold      = ()           => req('POST',  '/auction/unsold');
export const reAuction       = (playerId)   => req('POST', `/auction/reauction/${playerId}`);
export const useRTM          = (teamId)     => req('POST', `/auction/rtm/${teamId}`);
export const useWildcard     = (teamId)     => req('POST', `/auction/wildcard/${teamId}`);
export const switchQueueTab  = (tab)        => req('POST', `/auction/tab/${tab}`);

export const getRegistered       = ()       => req('GET',    '/registered');
export const addRegistered       = (body)   => req('POST',   '/registered', body);
export const editRegistered      = (id, b)  => req('PATCH',  `/registered/${id}`, b);
export const removeRegistered    = (id)     => req('DELETE', `/registered/${id}`);
export const sendToAuction       = (id)     => req('POST',  `/registered/${id}/send-to-auction`);