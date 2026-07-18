import { FeatureFlagService } from '../../src/modules/feature-flag/services/feature-flag.service';
import { Repository } from 'typeorm';
import { FeatureFlag } from '../../src/modules/feature-flag/entities/feature-flag.entity';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let repo: jest.Mocked<Repository<FeatureFlag>>;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new FeatureFlagService(repo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all non-deleted flags', async () => {
      const mockFlags = [{ id: '1', flagKey: 'test-flag' }];
      repo.find.mockResolvedValue(mockFlags as any);

      const result = await service.findAll();

      expect(result).toEqual(mockFlags);
      expect(repo.find).toHaveBeenCalled();
    });

    it('should return empty array when no flags exist', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create and save a new flag', async () => {
      const dto = { flagKey: 'new-flag', strategy: 'BOOLEAN', createdByUserId: 'user-1' };
      const mockEntity = { id: '1', ...dto };
      repo.create.mockReturnValue(mockEntity as any);
      repo.save.mockResolvedValue(mockEntity as any);

      const result = await service.create(dto as any);

      expect(result).toEqual(mockEntity);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockEntity);
    });
  });
});
