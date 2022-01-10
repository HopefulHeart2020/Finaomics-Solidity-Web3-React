import {useEagerConnect} from 'hooks/useEagerConnect';
import {useInactiveListener} from 'hooks/useInactiveListener';

export default function Web3ReactManager({children}) {
  const {tried} = useEagerConnect();
  useInactiveListener(!tried);
  return children;
}
