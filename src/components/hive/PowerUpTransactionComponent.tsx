import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PowerUp} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: PowerUp;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};

const PowerUpTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, amount, to, from} = transaction;
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedAmount = withCommas(amount);

  return (
    <ItemCardExpandable
      theme={theme}
      toggle
      setToggle={() => {}}
      date={date}
      textLine1={translate('wallet.operations.powerup.info_power_up')}
      textLine2={` ${formattedAmount} ${amount.split(' ')[1]}`}
      icon={
        useIcon ? (
          <Icon
            name={Icons.POWER_UP}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
    />
  );
};

export default PowerUpTransactionComponent;
