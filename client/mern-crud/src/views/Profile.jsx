const Profile = (props) => {
	const { currentUser } = props;
	return <div>{currentUser.userName} </div>;
};
export default Profile;
