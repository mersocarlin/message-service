import presenter from '../../presenter/message';
import messageRepository from '../../repository/message';
import * as message from '../../services/message';


export async function list (req, res) {
  res.send(
    200,
    presenter(
      await message.list(
        getRepositories()
      )
    )
  );
}

export async function create (req, res) {
  res.send(
    201,
    presenter(
      await message.create(
        getRepositories(),
        req.body,
      )
    )
  );
}

export async function detail (req, res) {
  res.send(
    200,
    presenter(
      await message.detail(
        getRepositories(),
        req.params.id,
      )
    )
  );
}

export async function update (req, res) {
  req.body.id = req.params.id; // eslint-disable-line no-param-reassign

  res.send(
    200,
    presenter(
      await message.update(
        getRepositories(),
        req.body,
      )
    )
  );
}

export async function remove (req, res) {
  res.send(
    200,
    presenter(
      await message.remove(
        getRepositories(),
        req.params.id,
      )
    )
  );
}

function getRepositories () {
  return {
    message: messageRepository(),
  };
}
