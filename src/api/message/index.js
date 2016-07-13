import presenter from '../../presenter/message';
import messageRepository from '../../repository/message';
import * as message from '../../services/message';


export async function list (req, res) {
  res
    .status(200)
    .send(
      presenter(
        await message.list(
          getRepositories(req.mongo)
        )
      )
    );
}

export async function create (req, res) {
  res
    .status(201)
    .send(
      presenter(
        await message.create(
          getRepositories(req.mongo),
          req.body,
        )
      )
    );
}

export async function detail (req, res) {
  res
    .status(200)
    .send(
      presenter(
        await message.detail(
          getRepositories(req.mongo),
          req.params.id,
        )
      )
    );
}

export async function update (req, res) {
  req.body.id = req.params.id; // eslint-disable-line no-param-reassign

  res
    .status(200)
    .send(
      presenter(
        await message.update(
          getRepositories(req.mongo),
          req.body,
        )
      )
    );
}

export async function remove (req, res) {
  res
    .status(200)
    .send(
      presenter(
        await message.remove(
          getRepositories(req.mongo),
          req.params.id,
        )
      )
    );
}

function getRepositories (mongo) {
  return {
    message: messageRepository(mongo),
  };
}
