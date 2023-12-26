import {ActiveAccount} from 'actions/interfaces';
import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {ReceivedInterests} from 'src/interfaces/transaction.interface';
import {withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: ReceivedInterests;
  locale: string;
  theme: Theme;
  token?: boolean;
  useIcon?: boolean;
};
const ReceivedInterestTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
}: Props) => {
  const {timestamp, interest} = transaction;
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={true}
      setToggle={() => {}}
      icon={
        useIcon ? (
          <Icon
            name={Icons.SAVINGS}
            theme={theme}
            bgImage={<BackgroundIconRed />}
          />
        ) : null
      }
      date={date}
      textLine1={`${translate('common.received')} ${withCommas(
        interest,
      )} ${getCurrency('HBD')}`}
      textLine2={translate('wallet.operations.savings.info_received_interests')}
    />
  );
};

export default ReceivedInterestTransactionComponent;
