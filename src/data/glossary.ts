export type GlossaryCategory = "contract" | "pricing" | "risk" | "strategy" | "greeks" | "market";

export type GlossaryTerm = {
  id: string;
  term: string;
  slug: string;
  category: GlossaryCategory;
  shortDefinition: string;
  fullDefinition: string;
  example?: string;
  relatedTermIds: string[];
  relatedLessonIds: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  term("option-contract", "Option contract", "contract", "A standardized agreement that gives option buyers rights and option sellers obligations.", "One listed equity option contract usually controls 100 shares. A call gives the holder the right to buy at the strike, and a put gives the holder the right to sell at the strike.", "A $2.00 option premium usually represents $200 per contract before fees.", ["call", "put", "premium"], ["lesson-option-contracts"]),
  term("call", "Call", "contract", "An option that gives the holder the right to buy the underlying at the strike.", "Calls generally gain intrinsic value when the underlying rises above the strike. Selling calls can create assignment obligations.", "A 100 call has $8 intrinsic value if the underlying is 108.", ["strike", "intrinsic-value"], ["lesson-calls-puts"]),
  term("put", "Put", "contract", "An option that gives the holder the right to sell the underlying at the strike.", "Puts generally gain intrinsic value when the underlying falls below the strike. Selling puts can create an obligation to buy shares.", "A 100 put has $8 intrinsic value if the underlying is 92.", ["strike", "assignment"], ["lesson-calls-puts"]),
  term("strike", "Strike", "contract", "The price at which the option can be exercised.", "The strike is central to payoff, moneyness, and assignment. Calls compare underlying price against the strike differently than puts.", "A 105 call starts to have intrinsic value above 105.", ["expiration", "breakeven"], ["lesson-strike-expiration-premium"]),
  term("premium", "Premium", "pricing", "The price paid or received for an option.", "Buyers pay premium and sellers receive premium. For equity options, premium is usually multiplied by 100 shares per contract.", "Buying 1 contract for $3.00 costs $300 before fees.", ["debit", "credit"], ["lesson-strike-expiration-premium"]),
  term("expiration", "Expiration", "contract", "The date after which the option no longer exists.", "Expiration defines the time window for the option. This MVP models expiration payoff for clarity.", "A June 19 option expires on that listed date.", ["theta", "calendar-spread"], ["lesson-strike-expiration-premium"]),
  term("exercise", "Exercise", "risk", "Using the option right to buy or sell at the strike.", "Exercise turns the option right into a stock transaction. Assignment is the matching obligation for a seller.", "Exercising a call buys shares at the strike.", ["assignment"], ["lesson-calls-puts"]),
  term("assignment", "Assignment", "risk", "The obligation assigned to an option seller when an option holder exercises.", "Short options can be assigned. Covered calls may sell shares, and cash-secured puts may buy shares at the strike.", "A short 95 put can assign the seller to buy shares at 95.", ["cash-secured-put", "covered-call"], ["lesson-cash-secured-put"]),
  term("intrinsic-value", "Intrinsic value", "pricing", "The immediate exercise value of an option.", "For calls, intrinsic value is max(0, underlying minus strike). For puts, it is max(0, strike minus underlying).", "A 100 call with stock at 106 has $6 intrinsic value.", ["extrinsic-value"], ["lesson-intrinsic-extrinsic"]),
  term("extrinsic-value", "Extrinsic value", "pricing", "The part of premium beyond intrinsic value.", "Extrinsic value reflects time, volatility, rates, dividends, and supply/demand. It decays toward expiration.", "If a call has $5 intrinsic value and trades at $7, extrinsic value is $2.", ["theta", "implied-volatility"], ["lesson-intrinsic-extrinsic"]),
  term("in-the-money", "In the money", "pricing", "An option with intrinsic value.", "A call is in the money when underlying price is above strike. A put is in the money when underlying price is below strike.", "A 95 call is ITM if the stock is 100.", ["intrinsic-value"], ["lesson-intrinsic-extrinsic"]),
  term("at-the-money", "At the money", "pricing", "An option whose strike is near the underlying price.", "ATM options often have high extrinsic value relative to nearby strikes.", "A 100 strike is ATM when the stock is near 100.", ["extrinsic-value"], ["lesson-intrinsic-extrinsic"]),
  term("out-of-the-money", "Out of the money", "pricing", "An option without intrinsic value.", "OTM options are entirely extrinsic at that moment.", "A 110 call is OTM if the stock is 100.", ["extrinsic-value"], ["lesson-intrinsic-extrinsic"]),
  term("breakeven", "Breakeven", "pricing", "The underlying price where a strategy is modeled at zero profit/loss.", "Breakevens depend on strike, premium, and strategy structure. They are not profit targets.", "A 100 call bought for $3 breakevens at 103.", ["premium"], ["lesson-long-call"]),
  term("debit", "Debit", "pricing", "Money paid to enter a position.", "Long options and debit spreads require paying premium upfront. The debit is often the defined maximum loss.", "Buying a call for $3 creates a $300 debit.", ["credit", "premium"], ["lesson-long-call"]),
  term("credit", "Credit", "pricing", "Money received to enter a position.", "Short option strategies may collect premium but can carry assignment or larger downside risk.", "Selling a put for $2 creates a $200 credit.", ["assignment"], ["lesson-cash-secured-put"]),
  term("spread", "Spread", "strategy", "A multi-leg options strategy combining different options.", "Spreads can define risk, reduce cost, or shape payoff. Vertical spreads use the same expiration and different strikes.", "A bull call spread buys one call and sells a higher-strike call.", ["debit", "credit"], []),
  term("covered-call", "Covered call", "strategy", "Long stock plus a short call.", "Covered calls collect premium but cap upside and can result in shares being called away.", "Own 100 shares and sell one call.", ["assignment"], ["lesson-covered-call"]),
  term("cash-secured-put", "Cash-secured put", "strategy", "A short put backed by cash to buy shares if assigned.", "The premium is the max profit, while downside remains if the stock falls materially.", "Sell a 95 put while reserving $9,500 per contract.", ["assignment"], ["lesson-cash-secured-put"]),
  term("protective-put", "Protective put", "strategy", "Long stock plus a long put.", "Protective puts create a downside floor at the cost of premium.", "Own shares at 100 and buy a 95 put.", ["premium"], ["lesson-protective-put"]),
  term("delta", "Delta", "greeks", "A Greek estimating option price sensitivity to underlying price.", "Delta is often used as a rough directional exposure estimate, but it changes as price and time change.", "A 0.50 delta call may move about $0.50 for a $1 stock move.", ["gamma"], []),
  term("gamma", "Gamma", "greeks", "A Greek estimating how much delta changes.", "Gamma is highest near at-the-money options close to expiration.", "High gamma means delta can change quickly.", ["delta"], []),
  term("theta", "Theta", "greeks", "A Greek estimating time decay.", "Theta describes how option value may decay as time passes, all else equal.", "Long options often have negative theta.", ["expiration"], []),
  term("vega", "Vega", "greeks", "A Greek estimating sensitivity to implied volatility.", "Vega matters when volatility changes, especially for longer-dated options.", "Higher implied volatility can raise option premiums.", ["implied-volatility"], []),
  term("implied-volatility", "Implied volatility", "market", "The volatility level implied by option prices.", "Implied volatility is not a forecast certainty. It is a market input embedded in premium.", "An earnings event can increase implied volatility.", ["vega", "premium"], []),
  term("open-interest", "Open interest", "market", "The number of outstanding option contracts.", "Open interest can provide liquidity context, but it is not a trading signal by itself.", "High open interest can indicate active contracts.", ["volume"], []),
  term("volume", "Volume", "market", "The number of contracts traded during a period.", "Volume shows trading activity for a contract during the session.", "A contract trading 5,000 lots today has 5,000 volume.", ["open-interest"], []),
].sort((left, right) => left.term.localeCompare(right.term));

function term(
  id: string,
  label: string,
  category: GlossaryCategory,
  shortDefinition: string,
  fullDefinition: string,
  example: string | undefined,
  relatedTermIds: string[],
  relatedLessonIds: string[],
): GlossaryTerm {
  return {
    id,
    term: label,
    slug: id,
    category,
    shortDefinition,
    fullDefinition,
    example,
    relatedTermIds,
    relatedLessonIds,
  };
}

