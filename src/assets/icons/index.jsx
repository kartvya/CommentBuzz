import { Colors } from "@/src/constants/Colors";
import ArrowLeft from "./ArrowLeft";
import Call from "./Call";
import Camera from "./Camera";
import Comment from "./Comment";
import Delete from "./Delete";
import Edit from "./Edit";
import Heart from "./Heart";
import Home from "./Home";
import Image from "./Image";
import Location from "./Location";
import Lock from "./Lock";
import Logout from "./logout";
import Mail from "./Mail";
import Plus from "./Plus";
import Search from "./Search";
import Send from "./Send";
import Share from "./Share";
import ThreeDotsCircle from "./ThreeDotsCircle";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";
import User from "./User";
import Video from "./Video";
import RightArrow from "./RightArrow";
import CloseEye from "./CloseEye";
import Eye from "./Eye";
import UpArrow from "./UpArrow";
import DownArrow from "./DownArrow";
import SoundOn from "./SoundOn";
import SoundOff from "./SoundOff";
import BuzzCoin from "./BuzzCoin";
import Cake from "./Cake";
import HamburgerMenu from "./HamburgerMenu";
import PostMore from "./PostMore";
import Refer from "./Refer";
import Clock from "./Clock";

const icons = {
  home: Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  search: Search,
  location: Location,
  call: Call,
  camera: Camera,
  edit: Edit,
  arrowLeft: ArrowLeft,
  threeDotsCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  comment: Comment,
  share: Share,
  send: Send,
  delete: Delete,
  logout: Logout,
  image: Image,
  video: Video,
  rightArrow: RightArrow,
  closeEye: CloseEye,
  eye: Eye,
  upArrow: UpArrow,
  downArrow: DownArrow,
  soundOn: SoundOn,
  soundOff: SoundOff,
  buzzCoin: BuzzCoin,
  cake: Cake,
  hamburgerMenu: HamburgerMenu,
  postMore: PostMore,
  refer: Refer,
  clock: Clock,
};

const SvgIcon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={Colors.black}
      {...props}
    />
  );
};

export default SvgIcon;
