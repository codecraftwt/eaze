import { getSalesforceToken } from './slices/authSlice';

/**
 * On 401, refresh Salesforce token once and retry so stale persisted tokens do not break API calls.
 */
export async function withSalesforce401Retry(dispatch, getState, token, execute) {
  try {
    return await execute(token);
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 && token) {
      try {
        await dispatch(getSalesforceToken()).unwrap();
        const newToken = getState().auth.salesforceToken;
        if (newToken) {
          return await execute(newToken);
        }
      } catch {
        /* reject below */
      }
    }
    throw err;
  }
}
