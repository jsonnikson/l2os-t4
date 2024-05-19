import { Car, Lexeme } from '@t4/api/src/db/schema'
import { Input, Paragraph, Spinner, VirtualList, XStack, YStack } from '@t4/ui'
import { formatNumber, formatPrice } from '@t4/ui/src/libs/number'
import { trpc } from 'app/utils/trpc'
import { empty, error, loading, success } from 'app/utils/trpc/patterns'
import React, { useState } from 'react'
import { SolitoImage } from 'solito/image'
import { match } from 'ts-pattern'
import { LexemeWithTranslations } from '@t4/api/src/routes/lexemes'
import { useQuery } from '@t4/api/src/graphql/client'

const LexemeList = ({ filter }: { filter: string }): React.ReactNode => {
  const lexemes = useQuery().lexemes({ filter })
  // if (lq.failureReason) return <CarListError message={lq.failureReason?.message} />
  // if (lq.isLoading)
  //   return (
  //     <YStack fullscreen f={1} jc='center' ai='center'>
  //       <Paragraph pb='$3'>Loading...</Paragraph>
  //       <Spinner />
  //     </YStack>
  //   )
  if (lexemes.length === 0) return <Paragraph>No lexemes found.</Paragraph>

  return <VirtualList data={lexemes} renderItem={LexemeListItem} itemHeight={40} />
}
let i = 1
export const LexemeListItem = (item: LexemeWithTranslations): React.ReactElement => {
  return (
    <YStack flexDirection='row' paddingLeft='$2'>
      <XStack>
        <Paragraph width='$10' paddingLeft='$3' paddingBottom='$1' fontSize={16}>
          {item.text ?? 'Loading…'}
        </Paragraph>
        <Paragraph paddingLeft='$3' fontSize={16} opacity={0.6}>
          {item.translations.map((x) => x.text ?? '…').join(', ')}
        </Paragraph>
      </XStack>
    </YStack>
  )
}

export const CarListError = ({ message }: { message: string | undefined }): React.ReactElement => {
  return (
    <YStack fullscreen f={1} jc='center' ai='center' p='$6'>
      <Paragraph pb='$3'>Error fetching cars</Paragraph>
      <Paragraph>{message}</Paragraph>
    </YStack>
  )
}

export function DevScreen() {
  // return (
  //   <YStack f={1} jc="center" ai="center" space>
  //     <Paragraph ta="center" fow="800">
  //       Dev
  //     </Paragraph>
  //     <LexemeList />
  //   </YStack>
  // );
  const [input, setInput] = useState('')
  return (
    <YStack fullscreen f={1} space>
      <Paragraph ta='center' fow='800'>
        Dev
      </Paragraph>
      <Input
        flexShrink={0}
        size='$4'
        placeholder='Search for word'
        onChangeText={(text) => setInput(text)}
      />
      <YStack f={1}>
        <LexemeList filter={input} />
      </YStack>
    </YStack>
  )
}
