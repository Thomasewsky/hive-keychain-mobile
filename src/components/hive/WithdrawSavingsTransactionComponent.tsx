import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {StartWithdrawSavings} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: StartWithdrawSavings;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const WithdrawSavingsTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, amount} = transaction;
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
      icon={
        useIcon ? (
          <Icon
            name={'savings'}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
      textLine1={`${translate(
        'common.started_a',
      )} ${formattedAmount} ${getCurrency('HBD')}`}
      textLine2={translate('wallet.operations.savings.start_withdraw_savings')}
      date={date}
    />
  );
};

export default WithdrawSavingsTransactionComponent;
