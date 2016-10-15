import presenter from '../../presenter/message';
import * as message from '../../services/message';


export async function list (req, res) {
  res
    .status(200)
    .send(
      presenter(
        await message.list(
          req.repositories
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
          req.repositories,
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
          req.repositories,
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
          req.repositories,
          req.body,
        )
      )
    );
}

export async function remove (req, res) {
  res
    .status(204)
    .send(
      await message.remove(
        req.repositories,
        req.params.id,
      )
    );
}
