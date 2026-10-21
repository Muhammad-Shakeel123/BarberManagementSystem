// Backward-compatible export.
// Existing controllers can keep importing ../services/appointment.service.js
// while the actual implementation lives inside services/appointment/.
export { default } from "./appointment/appointment.service.js";
