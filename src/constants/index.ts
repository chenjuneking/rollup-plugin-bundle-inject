export class InjectTag {
  public static readonly CSS = /<!--\s*inject:\s*css\s*-->/g;
  public static readonly JS = /<!--\s*inject:\s*js\s*-->/g;
  public static readonly HEAD_TAG = /<\/head>/g;
  public static readonly BODY_TAG = /<\/body>/g;
}
