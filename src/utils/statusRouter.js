import { fetchMyExpertProfile } from '../services/expertService';
import { fetchMyCenterProfile } from '../services/centerService';

/**
 * After login, fetch the role-specific profile and redirect based on status.
 * @param {object} user - CentralUser from /users/me
 * @param {function} navigate - React Router navigate
 * @returns {Promise<void>}
 */
export const routeByStatus = async (user, navigate) => {
  try {
    if (user.role === 'expert') {
      const profile = await fetchMyExpertProfile();
      if (!profile) {
        navigate('/expert/register');
      } else if (profile.status === 'pending' || profile.status === 'under_review') {
        navigate('/expert/pending');
      } else if (profile.status === 'approved') {
        navigate('/expert/dashboard');
      } else if (profile.status === 'rejected') {
        navigate('/expert/register?reapply=true');
      } else {
        navigate('/expert/register');
      }
    } else if (user.role === 'center') {
      const profile = await fetchMyCenterProfile();
      if (!profile) {
        navigate('/center/register');
      } else if (profile.status === 'pending' || profile.status === 'under_review') {
        navigate('/center/pending');
      } else if (profile.status === 'approved') {
        navigate('/center/dashboard');
      } else if (profile.status === 'rejected') {
        navigate('/center/register?reapply=true');
      } else {
        navigate('/center/register');
      }
    } else {
      navigate('/');
    }
  } catch (err) {
    console.error('[routeByStatus] Error:', err);
    // If /me endpoint fails (404), assume no profile
    if (user.role === 'expert') navigate('/expert/register');
    else if (user.role === 'center') navigate('/center/register');
    else navigate('/');
  }
};
