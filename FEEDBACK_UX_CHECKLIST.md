# Feedback UX Checklist

## Publisher -> Domains
- Add domain success: toast shows "Domain added".
- Demo mode add domain success: second toast shows "Domain verified".
- Add domain error: toast shows the server message when available.
- Domains list updates immediately after success.

## Publisher -> Pricing
### License settings
- Save action shows button loading state "Saving...".
- Save success: toast shows "License settings saved".
- Save error: toast shows server message when available.
- UI state reflects current enabled status and prices after save.

### Pricing rules builder
- Create action shows button loading state "Creating...".
- Create success: toast shows "Pricing rule created".
- New rule appears in the rules list immediately.
- Inputs clear only after successful creation.
- Create error: toast shows server message when available.
- Missing backend route error: toast shows "Pricing rules could not be created. Backend route not available." and inline hint shows "Pricing rules are required to allow paid access."
- Empty state is replaced by table immediately when first rule is created.

## Publisher -> Transactions
- Empty state text: "Transactions appear after an AI client redeems a token for your content."
- Refresh via Apply filters: toast shows "Updated".

## AI Client -> API Keys
- Create key success: toast shows "API key created".
- New key is displayed once with helper copy.
- Copy action provides a "Copied" button state.
- Create key error: toast shows server message when available.

## AI Client -> Agent Identity
- Save action shows button loading state "Saving...".
- Save success: toast shows "Agent identity saved".
- Save error: toast shows server message when available.

## AI Client -> Test Paid Request
- Inline status shows "Minting token..." then "Redeeming token..." during the flow.
- Mint success: toast shows "Token minted".
- Redeem success: toast shows "Content fetched".
- Missing pricing rule error: toast shows "No active pricing rule matches this domain, path, and license. Add one under Publisher Pricing."
- Max price error: toast shows "Price exceeds your max price limit".
- Success renders receipt panel with txId, priceMicros, domain, path, license, timestamp.
- Receipt can be copied and shows "Copied" state.
- Helper text: "Receipt is your audit handle."
