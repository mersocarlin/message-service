export default async function list (repositories) {
  return await repositories
    .message
    .findAll();
}
