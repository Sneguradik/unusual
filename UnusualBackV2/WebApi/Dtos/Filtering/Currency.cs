namespace WebApi.Dtos.Filtering;

public record CurrencyCreateDto(string Name, string Symbol);

public record CurrencyDeleteDto(int[] Ids);