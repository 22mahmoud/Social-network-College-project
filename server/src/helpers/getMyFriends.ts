import { getManager } from "typeorm";
import FriendRequest from "../modules/FriendRequest/FriendReques.entity";

const fetchData = async id =>
  await getManager()
    .createQueryBuilder(FriendRequest, "fq")
    .select()
    .where("fq.sender = :sender", { sender: id })
    .orWhere("fq.receiver = :receiver", { receiver: id })
    .andWhere("fq.isAccepted = true")
    .leftJoinAndSelect("fq.sender", "sender", "sender.id != :id", {
      id
    })
    .leftJoinAndSelect("fq.receiver", "receiver", "receiver.id != :id", {
      id
    })
    .getMany();

const getMyFriendsList = async id => {
  const friends = await fetchData(id);
  return friends.map(({ sender, receiver }) => ({
    user: (sender && sender.id) || (receiver && receiver.id)
  }));
};

export default getMyFriendsList;
