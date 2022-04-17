import { action } from "easy-peasy";

const user = {
  lockUser: {},
  setLockUser: action((state, payload) => {
    state.lockUser = payload;
  }),
};

export default user;
