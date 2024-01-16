import {ActiveAccount} from 'actions/interfaces';
import Vote from 'assets/governance/arrow_circle_up.svg';
import Loader from 'components/ui/Loader';
import moment from 'moment';
import React, {useState} from 'react';
import {
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  fields_primary_text_2,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {withCommas} from 'utils/format';
import {updateProposalVote} from 'utils/hive';
import {translate} from 'utils/localize';
import {FundedOption, Proposal} from 'utils/proposals';
import Icon from './Icon';

interface ProposalItemProps {
  user: ActiveAccount;
  proposal: Proposal;
  displayingProxyVotes: boolean;
  onVoteUnvoteSuccessful: () => void;
  style: StyleProp<ViewStyle>;
  theme: Theme;
}

const ProposalItem = ({
  proposal,
  user,
  onVoteUnvoteSuccessful,
  displayingProxyVotes,
  style,
  theme,
}: ProposalItemProps) => {
  const [isExpandablePanelOpened, setExpandablePanelOpened] = useState(false);
  const [isPressVote, setIsPressVote] = useState(false);
  const [
    isVotingUnvotingForProposal,
    setIsVotingUnvotingForProposal,
  ] = useState('');
  const goTo = (link: Proposal['link']) => {
    Linking.openURL(link);
  };

  const goToCreator = (creator: Proposal['creator']) => {
    Linking.openURL(`https://peakd.com/@${creator}`);
  };

  const toggleSupport = async (proposal: Proposal) => {
    if (!user.keys.active) {
      Toast.show(translate('governance.proposal.error.active'));
      return;
    }
    if (displayingProxyVotes) {
      Toast.show(translate('governance.proposal.error.using_proxy'));
      return;
    }
    setIsVotingUnvotingForProposal(proposal.creator);
    if (proposal.voted) {
      if (
        await updateProposalVote(user.keys.active, {
          voter: user.name,
          proposal_ids: [proposal.proposalId],
          approve: false,
          extensions: [],
        })
      ) {
        onVoteUnvoteSuccessful();
        Toast.show(translate('governance.proposal.success.unvote'));
      } else {
        Toast.show(translate('governance.proposal.error.unvote'));
      }
    } else {
      if (
        await updateProposalVote(user.keys.active, {
          voter: user.name,
          proposal_ids: [proposal.proposalId],
          approve: true,
          extensions: [],
        })
      ) {
        Toast.show(translate('governance.proposal.success.vote'));
        onVoteUnvoteSuccessful();
      } else {
        Toast.show(translate('governance.proposal.error.vote'));
      }
    }
    setIsVotingUnvotingForProposal('');
  };

  const styles = getStyles(theme, useWindowDimensions().height);
  const isvoting =
    isVotingUnvotingForProposal.trim().length > 0 &&
    isVotingUnvotingForProposal === proposal.creator;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[style, styles.container]}
      onPressOut={() => {
        if (isPressVote) {
          setIsPressVote(false);
        } else {
          setExpandablePanelOpened(!isExpandablePanelOpened);
        }
      }}>
      <View style={styles.firstLine}>
        <View style={styles.title}>
          <Text
            onLongPress={() => goTo(proposal.link)}
            style={styles.textTitle}>
            #{proposal.id} - {proposal.subject}
          </Text>
        </View>
        <Icon
          theme={theme}
          name={Icons.EXPAND_THIN}
          {...styles.expander}
          additionalContainerStyle={[
            styles.marginRight,
            isExpandablePanelOpened ? undefined : styles.rotate,
          ]}
        />
      </View>
      <View style={styles.secondLine}>
        <View style={styles.user}>
          <TouchableOpacity onLongPress={() => goToCreator(proposal.creator)}>
            <FastImage
              source={{
                uri: `https://images.hive.blog/u/${proposal.creator}/avatar`,
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text
            onLongPress={() => goToCreator(proposal.creator)}
            style={[styles.username, styles.textOpaque]}>
            {translate('governance.proposal.by', {name: proposal.creator})}
          </Text>
        </View>
        <View style={styles.voteButton}>
          {!isvoting && (
            <Vote
              fill={proposal.voted ? PRIMARY_RED_COLOR : 'lightgrey'}
              onPress={() => {
                setIsPressVote(true);
                toggleSupport(proposal);
              }}
            />
          )}
          {isvoting && <Loader size={'small'} animating />}
        </View>
      </View>
      {isExpandablePanelOpened && (
        <View style={styles.expanded}>
          <View>
            <View style={styles.detail}>
              <Icon
                theme={theme}
                name={Icons.ARROW_UP}
                additionalContainerStyle={styles.detailIcon}
                {...styles.iconBigger}
                color={getColors(theme).iconBW}
              />
              <Text style={[styles.username, styles.detailText]}>
                {proposal.totalVotes}
              </Text>
            </View>
            <View style={styles.detail}>
              <Icon
                theme={theme}
                name={Icons.CLOCK}
                additionalContainerStyle={styles.detailIcon}
                {...styles.icon}
                color={getColors(theme).iconBW}
              />
              <Text style={[styles.username, styles.detailText]}>
                {translate('governance.proposal.remaining', {
                  days: withCommas(
                    proposal.endDate
                      .diff(moment(new Date()), 'days')
                      .toString(),
                    0,
                  ),
                })}
              </Text>
            </View>
            <View style={styles.detail}>
              <Icon
                theme={theme}
                name={Icons.MONEY}
                additionalContainerStyle={styles.detailIcon}
                {...styles.icon}
                color={getColors(theme).iconBW}
              />
              <Text style={[styles.username, styles.detailText]}>
                {withCommas(proposal.dailyPay)}/
                {translate('governance.proposal.day')}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.status,
              proposal.funded === FundedOption.TOTALLY_FUNDED
                ? styles.funded
                : undefined,
            ]}>
            <Text
              style={[
                styles.textTitle,
                proposal.funded === FundedOption.TOTALLY_FUNDED
                  ? styles.whiteText
                  : undefined,
              ]}>
              {translate(`governance.proposal.${proposal.funded}`)}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    container: {paddingVertical: 10},
    firstLine: {
      flexDirection: 'row',
      marginBottom: 10,
      width: '100%',
      justifyContent: 'space-between',
    },
    whiteText: {color: 'white'},
    title: {
      width: '90%',
    },
    textTitle: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        height,
        {...title_primary_body_2}.fontSize,
      ),
    },
    expander: {width: 12, height: 12},
    secondLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    user: {
      flexDirection: 'row',
      alignContent: 'center',
    },
    avatar: {width: 30, height: 30, borderRadius: 15, marginRight: 10},
    expanded: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detail: {flexDirection: 'row', marginTop: 5, alignItems: 'center'},
    detailIcon: {marginRight: 10},
    detailText: {fontSize: 10},
    status: {
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderColor: getColors(theme).cardBorderColor,
      borderWidth: 1,
      borderRadius: 5,
    },
    username: {
      textAlignVertical: 'center',
      color: getColors(theme).secondaryText,
      ...fields_primary_text_2,
    },
    rotate: {
      transform: [{rotateX: '180deg'}],
    },
    textOpaque: {
      opacity: 0.7,
    },
    voteButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 20,
      height: 20,
    },
    iconBigger: {
      width: 22,
      height: 22,
    },
    marginRight: {marginRight: 5},
    funded: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
  });

export default ProposalItem;
